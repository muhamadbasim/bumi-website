# Agentic tapi Deterministic Workflow untuk Dev Web Bumi

Prinsip kerja resmi untuk project Bumi:

> **AI boleh generative saat berpikir. Eksekusi repo, media, build, deploy, dan maintenance harus deterministic.**

Dokumen ini mengubah insight dari artikel Rama Digital tentang *agentic tapi deterministic* menjadi SOP praktis untuk website Bumi.

## Tujuan

- Membuat proses development Bumi lebih cepat tanpa kehilangan kontrol.
- Mencegah AI melakukan perubahan desain/media/deploy secara liar.
- Memastikan setiap perubahan punya scope, approval gate, verification, dan audit trail.
- Menjaga kualitas visual Bumi: natural, premium, dark futuristic, corporate-tech, bukan “AI slop”.

## Layer Kerja

| Layer | Fungsi | Output wajib |
|---|---|---|
| Intent | Memahami permintaan user | Scope halaman/section terdampak |
| Planning | Menentukan asumsi, risiko, acceptance criteria | Mini-plan untuk perubahan non-trivial |
| Preview / Approval | Gate untuk visual/media/high-risk | Approval user sebelum implement/finalisasi |
| Tooling | Menggunakan script/checklist, bukan command acak | Command/tool yang jelas |
| Execution | Mengubah file sesuai scope | Diff yang bisa dijelaskan |
| Verification | Membuktikan perubahan berjalan | Build/typecheck/preflight/screenshot/link |
| Audit | Melaporkan hasil dan sisa risiko | Summary final yang bisa direview |

## Mana yang Agentic vs Deterministic

### Boleh Agentic

AI boleh eksploratif untuk:

- ide visual dan animasi,
- copywriting,
- layout alternatif,
- proposal hero video,
- analisis referensi,
- UX/content improvements,
- diagnosis bug dan opsi solusi.

### Harus Deterministic

Wajib pakai checklist/script/verifikasi untuk:

- edit repo,
- memasukkan/mengganti asset video/image,
- build/typecheck,
- deploy/production,
- SEO metadata utama,
- penghapusan file,
- perubahan config/domain,
- maintenance otomatis.

## Gate Khusus Media dan Hero Video

Untuk Bumi, media visual harus natural dan tidak terlihat seperti output generatif murahan.

Workflow wajib:

1. Buat atau temukan preview media.
2. Kirim preview ke chat untuk approval jika visual/media baru atau perubahan besar.
3. Jangan embed media final ke website sebelum approval.
4. Setelah embed, verifikasi hero video terlihat jelas dan tidak tertutup placeholder label/card.
5. Ambil screenshot/capture desktop dan mobile untuk bukti.

## Checklist Implementasi UI

Sebelum mengubah file:

- [ ] Scope jelas: halaman/section mana?
- [ ] Brand kit Bumi dipakai: dark navy, electric blue, light gray, white, Poppins, angular B, trusted futuristic corporate.
- [ ] Acceptance criteria jelas.
- [ ] Untuk media/visual besar: preview approval sudah ada atau perubahan masih draft-only.

Setelah mengubah file:

- [ ] Jalankan `npm run preflight`.
- [ ] Jalankan `npm run typecheck` jika menyentuh code/types.
- [ ] Jalankan `npm run build` sebelum klaim selesai.
- [ ] Ambil screenshot/capture untuk perubahan visual.
- [ ] Laporkan file yang berubah, hasil command, dan risiko tersisa.

## Checklist Deploy / Production

Tidak boleh deploy production hanya karena user bilang “lanjut” secara umum. Deploy perlu scope jelas.

- [ ] Git status/diff dicek jika repo memakai git.
- [ ] Preflight lulus.
- [ ] Typecheck/build lulus.
- [ ] Smoke test route penting.
- [ ] Preview/production URL tersedia.
- [ ] Screenshot section terdampak tersedia.
- [ ] Rollback path diketahui.

## High-Risk Actions yang Butuh Approval Eksplisit

- Deploy production.
- Mengganti hero video final.
- Menghapus asset/file.
- Mengubah domain/config/deployment.
- Mengubah SEO title/description utama.
- Redesign besar homepage/navigation.
- Perubahan schema/data/auth/payment/permission jika nanti ada backend.

## Maintenance Rules

Agent boleh otomatis memperbaiki hal low-risk seperti typo, lint/type issue sederhana, import rusak, atau laporan status.

Agent harus minta approval untuk perubahan visual besar, production deploy, delete asset, config, SEO utama, atau perubahan yang berpotensi merusak service.

## Command Standar

```bash
npm run preflight
npm run typecheck
npm run build
```

Jika tersedia, gunakan:

```bash
npm run verify
```

`verify` harus menjadi jalur deterministic utama sebelum klaim pekerjaan selesai.
