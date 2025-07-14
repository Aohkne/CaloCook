import { Modal, Button } from "antd";
import { useState } from "react";
import FilterBar from "./FilterBar"; // your reusable component

export default function FilterModal({ fields, onFilter }) {
  const [open, setOpen] = useState(false);

  const handleFilter = (values) => {
    onFilter(values); // pass to parent
    setOpen(false); // close modal after applying
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Filter
      </Button>

      <Modal
        title="Filter Options"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        centered
      >
        <FilterBar fields={fields} onFilter={handleFilter} />
      </Modal>
    </>
  );
}
