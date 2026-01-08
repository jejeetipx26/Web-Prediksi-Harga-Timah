import { NextRequest, NextResponse } from "next/server";
// biar bisa panggil dan jalanin si script.py
import { spawnSync } from "child_process";
import path from "path"; // Import path

// when FE kirim requrst method POST
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { startDate, endDate } = body;

        if (!startDate) {
            return NextResponse.json(
                { error: "startDate wajib diisi" },
                { status: 400 }
            );
        }

        const scriptPath = path.join(process.cwd(), "python-scripts");

        // Panggil Python script
        const py = spawnSync(
            "python",
            ["predict.py", "--start", startDate, "--end", endDate ? endDate : startDate],
            {
                encoding: "utf-8",
                cwd: scriptPath
            }
        );

        // Kalau Python gagal dijalankan sama sekali
        if (py.error) {
            return NextResponse.json({ error: py.error.message }, { status: 500 });
        }

        // Kalau Python jalan, tapi script-nya ERROR
        if (py.status !== 0) {
            // Coba parsing stdout jika script python nge-print JSON error
            try {
                const output = py.stdout.trim();
                // Jika output kosong, cek stderr
                if (!output) throw new Error(py.stderr);
                const err = JSON.parse(output);
                return NextResponse.json(err, { status: 400 });
            } catch (e) {
                // Kalau error Python BUKAN JSON
                console.error("Python Error:", py.stderr);
                return NextResponse.json({ error: py.stderr || "Script failed without error message" }, { status: 500 });
            }
        }

        // Kalau tidak ada error, ambil hasil prediksi
        const predictions = JSON.parse(py.stdout);
        return NextResponse.json({ predictions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}