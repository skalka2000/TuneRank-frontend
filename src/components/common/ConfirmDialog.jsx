import Modal from "./Modal";

function ConfirmDialog({
  isOpen,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <p>{message}</p>
      <div className="button-group-center">
        <button className="button button-secondary" onClick={onCancel}>
          {cancelText}
        </button>
        <button className="button button-danger" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
