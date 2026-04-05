import { useOrderForm } from "../../hooks/useOrderForm";
import { useGoPrint } from "../../hooks/useGoPrint";

export function OrderCreateCard() {
  const { session } = useGoPrint();
  const { orderForm, setOrderForm, setSelectedFile, handleSubmit } = useOrderForm();

  if (!session || !["student", "lecturer", "admin"].includes(session.user.role)) {
    return null;
  }

  return (
    <article className="card">
      <h2>Buat Pesanan Baru</h2>
      <form className="order-form" onSubmit={handleSubmit}>
        <label className="full-span">
          Upload Dokumen
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
              setOrderForm((current) => ({
                ...current,
                fileName: file ? file.name : current.fileName,
                fileType: file?.name.split(".").pop()?.toLowerCase() ?? current.fileType
              }));
            }}
          />
        </label>
        <label>Nama File<input value={orderForm.fileName} onChange={(event) => setOrderForm((current) => ({ ...current, fileName: event.target.value }))} placeholder="contoh: tugas-akhir.pdf" /></label>
        <label>Tipe File
          <select value={orderForm.fileType} onChange={(event) => setOrderForm((current) => ({ ...current, fileType: event.target.value }))}>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="ppt">PPT</option>
          </select>
        </label>
        <label>Jumlah Print<input type="number" min="0" value={orderForm.printQty} onChange={(event) => setOrderForm((current) => ({ ...current, printQty: Number(event.target.value) }))} /></label>
        <label>Jumlah Fotokopi<input type="number" min="0" value={orderForm.copyQty} onChange={(event) => setOrderForm((current) => ({ ...current, copyQty: Number(event.target.value) }))} /></label>
        <label>Jumlah Jilid<input type="number" min="0" value={orderForm.bindingQty} onChange={(event) => setOrderForm((current) => ({ ...current, bindingQty: Number(event.target.value) }))} /></label>
        <label>Metode Pengambilan
          <select value={orderForm.pickupMethod} onChange={(event) => setOrderForm((current) => ({ ...current, pickupMethod: event.target.value as typeof current.pickupMethod }))}>
            <option value="pickup">Ambil Sendiri</option>
            <option value="delivery">Diantar</option>
          </select>
        </label>
        <label>Pembayaran
          <select value={orderForm.paymentMethod} onChange={(event) => setOrderForm((current) => ({ ...current, paymentMethod: event.target.value as typeof current.paymentMethod }))}>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Transfer Bank</option>
          </select>
        </label>
        <label className="full-span">Deskripsi Tambahan<textarea value={orderForm.description} onChange={(event) => setOrderForm((current) => ({ ...current, description: event.target.value }))} placeholder="Contoh: jilid warna hitam, cover bening, kertas A4" /></label>
        <label className="full-span">Catatan File<textarea value={orderForm.notes} onChange={(event) => setOrderForm((current) => ({ ...current, notes: event.target.value }))} /></label>
        <label className="full-span">Alamat Pengantaran<textarea value={orderForm.deliveryAddress} onChange={(event) => setOrderForm((current) => ({ ...current, deliveryAddress: event.target.value }))} placeholder="Isi jika memilih delivery" /></label>
        <label className="full-span">Catatan Pesanan<textarea value={orderForm.orderNotes} onChange={(event) => setOrderForm((current) => ({ ...current, orderNotes: event.target.value }))} /></label>
        <button className="primary-btn full-span" type="submit">Kirim Pesanan</button>
      </form>
    </article>
  );
}
