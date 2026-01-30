function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button className="button" onClick={onCancel}>Cancel</button>
          <button className="button button-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
