import pandas as pd
import numpy as np
import joblib
import json
import sys
import argparse
import os
from datetime import datetime, timedelta
from tensorflow.keras.models import load_model
from prophet.serialize import model_from_json

# CLASS HYBRID PREDICTOR
class HybridPredictor:
    # load model
    def __init__(self, model_dir=None):
        if model_dir is None:
            model_dir = os.path.dirname(os.path.abspath(__file__))
            model_dir = os.path.join(model_dir, '')

        print(f"Loading models from: {model_dir}", file=sys.stderr)
        try:
            self.lstm_model = load_model(os.path.join(model_dir, 'lstm_model.h5'), compile=False)
            self.scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
            with open(os.path.join(model_dir, 'prophet_model.json'), 'r') as fin:
                self.prophet_model = model_from_json(fin.read())
            self.look_back = 21
        except Exception as e:
            print(f"Error loading models: {e}", file=sys.stderr)
            raise

    def _prepare_lstm_input(self, last_data_df):
        # cek data apakah cukup untuk prediksi untuk diambil datanya sebanyak 21 hari
        if len(last_data_df) < self.look_back:
            raise ValueError(f"Data kurang! Butuh minimal {self.look_back} baris.")

        df_subset = last_data_df.tail(self.look_back).copy()
        forecast_past = self.prophet_model.predict(df_subset[['ds']])
        real_values = df_subset['y'].values
        prophet_values = forecast_past['yhat'].values
        # hitung residual
        residuals = real_values - prophet_values
        residuals = residuals.reshape(-1, 1)
        scaled_residuals = self.scaler.transform(residuals)
        return np.array([scaled_residuals])

    def predict_by_range(self, history_data, start_date_str, end_date_str):
        target_start = pd.to_datetime(start_date_str)
        target_end = pd.to_datetime(end_date_str)
        last_csv_date = history_data['ds'].iloc[-1]

        # KASUS 1: Request prediksi yg ada di csv
        if target_end <= last_csv_date:
            mask = (history_data['ds'] >= target_start) & (history_data['ds'] <= target_end)
            result = history_data[mask].copy()
            result = result.rename(columns={'ds': 'date', 'y': 'price'})
            # FILTER: Hanya kembalikan kolom date & price, buang Vol/Change dll
            return result[['date', 'price']]

        # KASUS 2: Request prediksi masa depan
        total_steps = (target_end - last_csv_date).days

        # Proses Looping prediksi
        current_batch = self._prepare_lstm_input(history_data)
        start_gen_date = last_csv_date + timedelta(days=1)
        full_dates = pd.date_range(start=start_gen_date, periods=total_steps)
        full_future_df = pd.DataFrame({'ds': full_dates})

        prophet_forecast = self.prophet_model.predict(full_future_df)
        prophet_yhat = prophet_forecast['yhat'].values

        lstm_residuals_scaled = []
        for i in range(total_steps):
            pred_res = self.lstm_model.predict(current_batch, verbose=0)[0]
            lstm_residuals_scaled.append(pred_res)
            current_batch = np.append(current_batch[:, 1:, :], [[pred_res]], axis=1)

        lstm_residuals = self.scaler.inverse_transform(lstm_residuals_scaled).flatten()
        # Harga final = prediksi Prophet + koreksi LSTM
        final_values = prophet_yhat + lstm_residuals

        full_result_df = pd.DataFrame({
            'date': full_dates,
            'price': final_values
        })

        # Filter hasil prediksi sesuai di minta user
        mask_user = (full_result_df['date'] >= target_start) & (full_result_df['date'] <= target_end)
        final_output = full_result_df.loc[mask_user].copy()

        # Gabung History jika overlap
        if target_start <= last_csv_date:
            hist_mask = (history_data['ds'] >= target_start) & (history_data['ds'] <= last_csv_date)
            hist_part = history_data[hist_mask].copy()
            hist_part = hist_part.rename(columns={'ds': 'date', 'y': 'price'})

            # Ambil hanya kolom yang diperlukan
            hist_part = hist_part[['date', 'price']]
            final_output = pd.concat([hist_part, final_output], axis=0)

        return final_output[['date', 'price']]

# main program untuk ekseuki
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', type=str)
    parser.add_argument('--start', type=str)
    parser.add_argument('--end', type=str)
    args = parser.parse_args()

    try:
        start_input, end_input = None, None

        if args.json:
            try:
                raw_input = args.json.strip()
                if raw_input.startswith("'") and raw_input.endswith("'"):
                    raw_input = raw_input[1:-1]
                params = json.loads(raw_input)
                start_input = params.get('startDate')
                end_input = params.get('endDate')
            except Exception as e:
                print(json.dumps({"error": "JSON Error", "details": str(e)}))
                sys.exit(1)
        elif args.start and args.end:
            start_input = args.start
            end_input = args.end
        else:
            print(json.dumps({"error": "Missing arguments"}))
            sys.exit(1)

        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(script_dir, 'historicalprices.csv')

        predictor = HybridPredictor()

        # Load CSV
        df_real = pd.read_csv(csv_path)
        df_real = df_real.rename(columns={'Date': 'ds', 'Price': 'y'})
        df_real['ds'] = pd.to_datetime(df_real['ds'])

        # Bersihkan data harga
        if df_real['y'].dtype == object:
            df_real['y'] = df_real['y'].astype(str).str.replace(',', '').astype(float)

        df_real = df_real.sort_values('ds')

        # Jalankan Prediksi
        hasil = predictor.predict_by_range(df_real, start_input, end_input)

        # --- LANGKAH PENTING: PEMBERSIHAN AKHIR ---

        # 1. Pastikan Date string
        hasil['date'] = hasil['date'].dt.strftime('%Y-%m-%d')

        # 2. Ganti NaN dengan None (agar jadi null di JSON)
        # NaN tidak valid di JSON standar
        hasil = hasil.where(pd.notnull(hasil), None)

        # 3. Pastikan hanya kolom date dan price yang dikirim
        final_output = hasil[['date', 'price']].to_dict(orient='records')

        print(json.dumps(final_output))

    except Exception as e:
        # Tangkap error Python dan kirim sebagai JSON
        print(json.dumps({"error": str(e)}))
        sys.exit(1)