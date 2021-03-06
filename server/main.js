import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/db/TasksCollection';
import '../imports/api/TaskMethods';
import '../imports/api/tasksPublications';

const insertTask = taskText => TasksCollection.insert({ 
  text: taskText,
  userId : user._id,
  CreatedAt: new Date(),
});

const SEED_USERNAME = 'Anil'
const SEED_PASSWORD = '1234'

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)){
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    })
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME)

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
      'Eighth Task'
    ].forEach(taskText => insertTask(taskText,user));
  }
});
