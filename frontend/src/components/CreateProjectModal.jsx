import Modal from "./Modal";
import CreateProject from "../pages/CreateProject";

function CreateProjectModal({ onCreated }) {
  return (
    <Modal id="create_project_modal" title="New Project">
      <CreateProject onCreated={onCreated} />
    </Modal>
  );
}

export default CreateProjectModal;
