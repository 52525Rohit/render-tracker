import Modal from "./Modal";
import AddCameraForm from "./AddCameraForm";

function AddCameraModal({ projectId, onAdded }) {
  return (
    <Modal id="add_camera_modal" title="Add Camera">
      <AddCameraForm projectId={projectId} onAdded={onAdded} />
    </Modal>
  );
}

export default AddCameraModal;
