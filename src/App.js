
import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";


//   to get data from LS

const getLocalData = () => {
    let list = localStorage.getItem('lists');

    if (list) {
        return JSON.parse(localStorage.getItem('lists'));
    }
    else {
        return [];
    }
}


const App = () => {
	const [ toggleBtn, setToggleBtn ] = useState(true);
	const [ inputTask, setInputTask ] = useState('');
	const [ editTask, setEditTask ] = useState(null);
	const [ tasks, setTasks ] = useState(getLocalData([]));
	const [ completedTask, setCompletedTask ] = useState(JSON.parse(localStorage.getItem('newLists')) || []);
	let [ updatedDate, setUpdatedDate ] = useState(null);
	const [pickDate, setPickDate] = useState(new Date());
	const [ taskInModal, setTaskInModal] = useState([]);


	// Adding Items
	const addTask = () => {
		if (!inputTask) {
			alert('Please fill the data');
		} else if (inputTask && !toggleBtn) {
			setTasks(
				tasks && tasks.map((elem) => {
					if (elem.id === editTask) {
						return { ...elem, name: inputTask, 
							taskDate: new Date().toLocaleString() };
					}
					return elem;
				})
			);
			setToggleBtn(true);
			setInputTask('');
			setEditTask(null);
		} else {
			const allinputTask = { id: new Date().getTime().toString(), 
				name: inputTask,
				taskDate : new Date().toLocaleString(),
				timeToCompleteTask : new Date(Date.now() + (3600 * 1000 * 24)).toLocaleString(),
				 };
			setTasks([ ...tasks, allinputTask ]);
			setInputTask('');
		}
	};


	// Editing items
	const editTasks = (id) => {
		let newEditTask = tasks.find((elem) => {
			return elem.id === id;
		});
		setToggleBtn(false);

		setInputTask(newEditTask.name);

		setEditTask(id);
	};

	//Delete Items

	const deleteTask = (index) => {
		const updatedTask = tasks.filter((elem) => {
			return index !== elem.id;
		});

		setTasks(updatedTask);
	};

	// Storage for Incomplete task section
	useEffect(
		() => {
			localStorage.setItem('lists', JSON.stringify(tasks));
		},
		[ tasks ]
	);

	// Storage for Complete taks section
	useEffect(
		() => {
			localStorage.setItem('newLists', JSON.stringify(completedTask));
		},
		[ completedTask ]
	);

	// Moving Items from InCompleted task to complete task section
	const taskCheckList = (id) => {
		const moveTask = tasks.find((e) => e.id === id);
		completedTask.push(moveTask);
		const filterITask = tasks.filter((e) => e.id !== id);
		localStorage.setItem('newLists', JSON.stringify(completedTask));
		setTasks(filterITask);
		updatedDate = new Date().toLocaleString();
		setUpdatedDate(updatedDate);
	};

	// Getting Back Items from Completed task section
	const newTaskCheckList = (id) => {
		const returnTask = completedTask.find((e) => e.id === id);
		tasks.push(returnTask);
		const filterReturnTask = completedTask.filter((e) => e.id !== id);
		localStorage.setItem('lists', JSON.stringify(tasks));
		setCompletedTask(filterReturnTask);
	};

	// return Task to Incomplete section with updated time
	const handleTaskDateTime = () => {
		setTaskInModal(taskInModal)
	}
	

	return (
		<div className="container">
			<h1>
				<span className="label label-primary">Add your task here</span>
			</h1>
			<div className="row">
				<div className="col-sm-6">
					<div className="input-group mb-3">
						<input	type="search" className="form-control"
							placeholder="Enter the task" value={inputTask}
							onChange={(e) => {
							setInputTask(e.target.value)
						}}	/>
						{toggleBtn ? (
							<div className="input-group-append">
								<button	className="btn btn-outline-primary"
									type="button"	title="Add task"
									onClick={addTask}>	Add
								</button>
							</div>
						) : (
							<button	className="btn btn-outline-primary"
								    type="submit" onClick={addTask}title="Update task">
								Update
							</button>
						)}
					</div>
				</div>
			</div>
			{/* InComplete task Start */}
			<div className="row">
				<div className="col-6">
					<h3>
						<span className="label label-primary">Incomplete Tasks</span>
					</h3>
					<table className="table table-bordered">
						<thead>
							<tr>
								<th scope="col">Select</th>
								<th scope="col">Task Name</th>
								<th scope="col">Created / Updated At</th>
								<th scope="col">Complete Date</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
						{tasks && tasks.map((elem, index) => {
							return (
							<tr key={index}>
								<th scope="row">
									<input	className="form-check-input me-1" type="checkbox"
											onChange={() => taskCheckList(elem.id)}/>
								</th>
								<td>{elem.name}</td>
								<td>{elem.taskDate}</td>
								<td>{elem.timeToCompleteTask}</td>
								<td>
									<i className="fas fa-edit"	title="Edit task"
									   onClick={() => editTasks(elem.id)}
										style={{ marginRight: '15px' }}	/>

									<i	className="fas fa-trash-alt"
										title="Delete task"	onClick={() => deleteTask(elem.id)}	/>
								</td>
							</tr>
							);
							})}
						</tbody>
					</table>
				</div>
				{/* InComplete task End */}

				{/* Complete task Start */}
				<div className="col-6">
					<h3>Completed Tasks</h3>
					<table className="table table-bordered">
						<thead>
							<tr>
								<th scope="col">Task Name</th>
								<th scope="col">Completed Date</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
						{completedTask.map((e, index) => {
							return (
							<tr scope="row" key={index}>
								<td>{e.name}</td>
								<td >{e.updatedDate}</td>
								<td>

								<input	className="form-check-input me-1" type="checkbox"
								onChange={() => newTaskCheckList(e.id)}	/>
								 
								<i	className="fas fa-edit"	title="Edit task" 
								data-bs-toggle="modal" data-bs-target="#modalToUpdateTask"
								onClick={handleTaskDateTime}/>
								</td>
							</tr>
							);
							})}
						</tbody>
					</table>
				</div>
			</div>
			{/* Complete task End */}

			{/* Pop Up Modal Code Start */}
			<div className="modal fade" id="modalToUpdateTask" data-bs-backdrop="static" 
			data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" 
			aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="staticBackdropLabel">Pict a Date</h5>
					<button type="button" className="btn-close" data-bs-dismiss="modal" 
					aria-label="Close"></button>
				</div>
				<div className="modal-body makeRow">
					<h6>Name of Task:{}</h6>
					<h6>Select Date : <input type="date" 
				onChange={(date) => setPickDate(date)}
			 	selected={pickDate}
				dateFormat="dd/MM/yyyy h:mm aa"
				timeInputLabel="Time:"
				showTimeInput /></h6>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-outline-primary" data-bs-dismiss="modal"
					// onClick={handleSubmit}
					>Submit</button>
				</div>
				</div>
			</div>
			</div>
			{/* Pop Up Modal Code End */}
		</div>
	);
};

export default App;
