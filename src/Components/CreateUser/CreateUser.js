import React, { useState } from "react";

const CreateUser = props => {
  const initialData = { id: null, username: "", task: ""};
  const [user, setUser] = useState(initialData);

  const onInputChange = event => {
    const { name, value } = event.target;

    setUser({ ...user, [name]: value });
  };

  const cancel = event => {
    event.preventDefault();
    props.setActiveModal({ active: false });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!user.first_name || !user.last_name) return;
        props.createUser(user);
      }}
    >
      <div className="form-group">
        <label>Uer Name</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Task Name</label>
        <input
          type="text"
          name="task"
          value={user.task}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group form-group--actions">
        <button className="primary-btn">Create</button>
        <button className="cancel-btn" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateUser;
