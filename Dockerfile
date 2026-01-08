# --- 1. Pakai base image Node.js (Versi stabil) ---
FROM node:18-bullseye

# --- 2. Install Python di dalam container ini ---
# Kita update linux-nya dan install python3 serta pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# (Opsional) Buat agar perintah 'python' merujuk ke 'python3'
# Ini penting biar spawnSync('python', ...) kamu jalan lancar
RUN ln -s /usr/bin/python3 /usr/bin/python

# --- 3. Atur folder kerja ---
WORKDIR /app

# --- 4. Install Library Python dulu ---
# Copy file requirements.txt ke dalam container
COPY requirements.txt ./
# Install library-nya (gunakan --break-system-packages karena di container)
RUN pip3 install -r requirements.txt --break-system-packages

# --- 5. Install Dependency Node.js ---
COPY package*.json ./
RUN npm install

# --- 6. Copy semua kode project kamu ---
COPY . .

# --- 7. Build Next.js ---
RUN npm run build

# --- 8. Jalankan Aplikasi ---
EXPOSE 3000
CMD ["npm", "start"]