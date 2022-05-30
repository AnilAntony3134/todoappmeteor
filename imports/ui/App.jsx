import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import {useTracker} from 'meteor/react-meteor-data'
import { TasksCollection } from '../db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import LoginForm from './LoginForm';


const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('task-checkbox',_id,!isChecked)
}

const deleteTask = ({_id}) => Meteor.call('task-remove',_id)

export const App = () => {
  const user = useTracker(()=> Meteor.user()); 

  const [hideCompleted,SetHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? {userId: user._id} : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter}

  const {tasks, pendingTasksCount , isLoading} = useTracker(()=> {
    const noDataAvailable = {tasks: [], pendingTasksCount: 0};
    if(!Meteor.user()){
      return noDataAvailable
    }
    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()){
      return{...noDataAvailable, isLoading:true};
    }
    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort : { createdAt: -1}
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return {tasks,pendingTasksCount}
  })
  const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ''}`;
  const logout = () => Meteor.logout()
  
  return(
  <div className='app'>
    <header>
      <div className="app-bar">
        <div className="app-header">
            <h1>To do list using meteor</h1>
            {pendingTasksTitle}
        </div>
      </div>
    </header>
    <div className="main">
    {user? (
      <Fragment>
        <div className='logoutconatiner'>
        <div className="user">
        <span>Hello {user.username} </span>
      </div>
      <div className="logout" onClick={logout}>
        <span>Log Out</span>
      </div>
      </div>
    <TaskForm user={user}/>
      <div className="filter">
        <button onClick={()=> SetHideCompleted(!hideCompleted)}>
          {hideCompleted ? "Show All" : "Hide Completed"}
        </button>
      </div>
      {isLoading && <div className='loading'>loading</div>}
      <ul className='tasks'>
          {tasks.map(task => <Task key={task.text} task={task} onCheckboxClick={toggleChecked} onDeleteClick={deleteTask}/>)}    
      </ul>  
      </Fragment>): (
        <LoginForm />
      )}

    </div>
  </div>
)};
