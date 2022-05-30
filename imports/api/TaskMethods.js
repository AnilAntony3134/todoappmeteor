import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { TasksCollection } from '../db/TasksCollection'

Meteor.methods({
    'task.insert'(text){
        check(text,String);

        if (!this.userId) {
            throw new Meteor.Error('Not Authorized');
        }

        TasksCollection.insert({
            text,
            createdAt: new Date(),
            userId: this.userId
        })

    },
    'task-remove'(_id){
        check(_id,String)

        if (!this.userId)
        {throw new Meteor.Error("Not Authorized")}

        const task = TasksCollection.findOne({_id: _id, userId: this.userId})

        if(!task){
            throw new Meteor.Error("Access Denied");
        }

        TasksCollection.remove(_id)
    },

    'task-checkbox'(_id,isChecked)
    {
        check(_id,String)
        check(isChecked,Boolean)

        if(!this.userId)
        throw new Meteor.Error("Not Authorized")

        const task = TasksCollection.findOne({_id:_id, userId:this.userId})

        if (!task) {throw new Meteor.Error("Access Denied")}

        TasksCollection.update(_id,{
            $set: {isChecked}
        })
    }

})