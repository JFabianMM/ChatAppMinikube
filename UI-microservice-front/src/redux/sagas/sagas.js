import { put, call, takeEvery, all } from 'redux-saga/effects';
import {gql} from '@apollo/client';
import client from '../../app';
import { updateUserData } from '../slice/userDataSlice';
import { updateToken } from '../slice/tokenSlice';
import { updateContacts } from '../slice/contactsSlice';

import { updateGroups } from '../slice/groupsSlice';
import { updateNotifications } from '../slice/notificationsSlice';
import { updateGroupNotifications } from '../slice/groupNotificationsSlice';
import {eliminateGroupNotification} from '../slice/groupNotificationsSlice';
import { updateRooms } from '../slice/roomsSlice';
import { updateMessages } from '../slice/messagesSlice';
import { updatePage } from '../slice/pageSlice';
import {updateRequesters} from '../slice/requestersSlice';
import { updateGroupRequesters } from '../slice/groupRequestersSlice';
import {addRooms} from '../slice/roomsSlice';
import {addNewContactMessage} from '../slice/messagesSlice';

// ----------------------------------------------- 
const Get_User = gql`
query user($email: String!){
  user(email: $email) {
      _id
      email
      firstName
      lastName
  }
}
`;

function getUserFunction (email){
  const result = client.query({
    query: Get_User,
    variables: {email: email}
  })
  return result
}
  function* queryUserFunction(action) {
    const { data } = yield call(getUserFunction, action.email);
    yield put({ type: 'GET_USER_UPDATE', data })
}  

function* queryUser(action){
  console.log('action: ', action);
  console.log('llegó hasta aqui')
  yield takeEvery('QUERY_USER', queryUserFunction)
}  
// ----------------------------------------------- 

const Get_Contact = gql`
query getContact ($id: String!){
    contacts( id: $id) {
        identification
        email
        contacts{
            id
            room
            email
            firstName
            lastName
   }
 }
}
`
function getContactFunction (id){
  const result = client.query({
    query: Get_Contact,
    variables: {id: id}
  })
  return result
}
  function* queryContactFunction(action) {
    const { data } = yield call(getContactFunction, action.id);
    console.log('queryContactFunction data: ', data.contacts);
    yield put(updateContacts(data.contacts.contacts));

    // yield put({ type: 'GET_CONTACT_UPDATE', data })
}  

function* queryContact(action){
  console.log('Llegó a queryContact')
  yield takeEvery('QUERY_CONTACT', queryContactFunction)
}  

// ----------------------------------------------- 

const Get_LogIn = gql`
query createLogin ($email: String!, $password: String!){
  createLogin( input: {
      email: $email,
      password: $password
  }) {
      user {
          _id
          email
          firstName
          lastName
      }
      token
      contact {
        identification
        email
        contacts {
          id
          room
          email
          firstName
          lastName
        }
      }
      notification {
        _id
        email
        notifications {
          id
          email
          firstName
          lastName
        }
      }
      groupnotification {
        room
        members {
          id
          email
          firstName
          lastName
        }
      }
      group {
        room
        members {
          id
          email
          firstName
          lastName
        }
      }
  }
}
`
function getLogInFunction (email, password){
  const result = client.query({
    query: Get_LogIn,
    variables: {email: email, password: password}
  })
  return result
}
  function* queryLogInFunction(action) {
    const { data } = yield call(getLogInFunction, action.email, action.password);

    function addNewChat(contact,data){
      let room=contact.room;
      let users=[{id:data._id, userName:data.firstName + ' ' +data.lastName, src:'' },{id:contact.id, userName:contact.firstName + ' ' +contact.lastName, src:'' }];
      let messages=[];
      let contactRoom={
          room:room, 
          users:users,
          messages:messages
      }
      return contactRoom;
  }

  function addNewGroupChat(group){
    let room=group.room;
    let users=group.members;
    let messages=[];
    let contactRoom={
        room:room, 
        users:users,
        messages:messages
    }
    return contactRoom;
  }

  yield put(updateUserData(data.createLogin.user))
  yield put(updateToken(data.createLogin.token));
  yield put(updateContacts(data.createLogin.contact.contacts));
            
    // CONTACTS 
    let addedRooms=[];
    let chat=[];
    let newRoom={};
    let contacts=data.createLogin.contact.contacts;
    contacts.map((contact) =>{ 
        newRoom={
            id:contact.id,
            room:contact.room
        }
    chat= chat.concat(addNewChat(contact,data.createLogin.user));
    addedRooms = addedRooms.concat(newRoom);
    })
   
    yield put(updateNotifications(data.createLogin.notification.notifications.length));
    yield put(updateGroupNotifications(data.createLogin.groupnotification.length));
    yield put(updateGroups(data.createLogin.group));

    let groups=data.createLogin.group;
 
    newRoom={};
    groups.map((group) =>{ 
        newRoom={
            id:group.room,
            room:group.room
        }
        chat= chat.concat(addNewGroupChat(group));
        addedRooms = addedRooms.concat(newRoom);
    })
   
    yield put(updateMessages(chat));
    yield put(updateRooms(addedRooms));
    yield put(updatePage('chat'));

}  

function* queryLogIn(action){
  yield takeEvery('QUERY_LOGIN', queryLogInFunction)
}  

// ----------------------------------------------- 

const Put_SignUp = gql`
mutation createaUser ($email: String!, $password: String!, $firstName: String!, $lastName: String!){
  createUser( input: {
        email: $email,
        password: $password,
        firstName: $firstName,
        lastName: $lastName
  }) {
        _id
        email
        firstName
        lastName
        tokens {
            token
        }
        }
  }
`
function putSignUpFunction (email, password, firstName, lastName){
  const result = client.mutate({
    mutation: Put_SignUp,
    variables: {email: email, password: password, firstName: firstName, lastName: lastName}
  })
  return result
}
  function* mutationSignUpFunction(action) {
    const { data } = yield call(putSignUpFunction, action.email, action.password, action.firstName, action.lastName);
    console.log('data: ', data);
    yield put(updatePage('signIn'));
  }  

  function* mutationSignUp(action){
    yield takeEvery('MUTATION_SIGNUP', mutationSignUpFunction)
  }  

// ----------------------------------------------- 
// ----------------------------------------------- 
const Get_Notification = gql`
query notification ($id: String!){
  notifications( id: $id) {
      notifications {
          id
          email
          firstName
          lastName
      }
  }
}
`;

function getNotificationFunction (id){
  const result = client.query({
    query: Get_Notification,
    variables: {id: id}
  })
  return result
}
  function* queryNotificationFunction(action) {
    const { data } = yield call(getNotificationFunction, action.id);
    console.log('queryNotificationFunction data: ', data);
    yield put(updateRequesters(data.notifications.notifications));
}  

function* queryNotification(action){
  yield takeEvery('QUERY_NOTIFICATION', queryNotificationFunction)
}  
// -----------------------------------------------
// ----------------------------------------------- 
const Get_Group_Notification = gql`
query groupnotifications($id: String!){
  groupnotifications(id: $id) {
 room
 members{
     id
     email
     firstName
     lastName
 }
}
}
`;

function getGroupNotificationFunction (id){
  const result = client.query({
    query: Get_Group_Notification,
    variables: {id: id}
  })
  return result
}
  function* queryGroupNotificationFunction(action) {
    const { data } = yield call(getGroupNotificationFunction, action.id);
    console.log('queryGroupNotificationFunction data: ', data);
    yield put(updateGroupRequesters(data.groupnotifications));
    //setGrouprequesters(answer.data.groupnotifications);
}  

function* queryGroupNotification(action){
  yield takeEvery('QUERY_GROUP_NOTIFICATION', queryGroupNotificationFunction)
}  
// -----------------------------------------------

// ----------------------------------------------- 

const Put_CreateNotification = gql`
mutation createNotification($identification: String!, $email: String!, $id: String, $useremail: String!, $firstName: String, $lastName: String){
  createNotification( input: {
    identification: $identification,
    email: $email,
    id: $id,
    useremail: $useremail,
    firstName: $firstName,
    lastName: $lastName
}) {
  _id
  email
  }
}
`
function putCreateNotificationFunction (identification, email, id, useremail, firstName, lastName){
  const result = client.mutate({
    mutation: Put_CreateNotification,
    variables: {identification: identification, email: email, id: id, useremail: useremail, firstName: firstName, lastName: lastName}
  })
  return result
}
  function* mutationCreateNotificationFunction(action) {
    const { data } = yield call(putCreateNotificationFunction, action.identification, action.email, action.id, action.useremail, action.firstName, action.lastName);
    console.log('data: ', data);
  }  

  function* mutationCreateNotification(action){
    yield takeEvery('MUTATION_CREATE_NOTIFICATION', mutationCreateNotificationFunction)
  }  

// ----------------------------------------------- 

// ----------------------------------------------- 

const Put_CreateGroupNotification = gql`
mutation createGroupAndNotifications($id: String, $email: String, $room: String, $input: [newmember] ) {
  createGroupAndNotifications( input: {
            id: $id,
            email: $email,
            group:
                    {
                       room: $room,
                       members: $input
                   }
     }) {
           room
               members{
               id
               email
               firstName
               lastName
           }
       }
   }
`
;
function putCreateGroupNotificationFunction (id, email, room, input){
  const result = client.mutate({
    mutation: Put_CreateGroupNotification,
    variables: {id: id, email: email, room: room, input: input}
  })
  return result
}
  function* mutationCreateGroupNotificationFunction(action) {
    const { data } = yield call(putCreateGroupNotificationFunction, action.id, action.email, action.room, action.input);
    console.log('mutationCreateGroupNotificationFunction data: ', data);
    yield put(updateGroups(data.createGroupAndNotifications));

    let len=data.createGroupAndNotifications.length;

    let newRoom={
        id: data.createGroupAndNotifications[len-1].room,
        room: data.createGroupAndNotifications[len-1].room
    }

    yield put(addRooms(newRoom));

    function addNewGroupChat(group){
        let room=group.room;
        let users=group.members;
        let messages=[];
        let contactRoom={
            room:room, 
            users:users,
            messages:messages
        }
        return contactRoom;
    }

  let group=data.createGroupAndNotifications[len-1];
   
  yield put(addNewContactMessage(addNewGroupChat(group)));






  }  

  function* mutationCreateGroupNotification(action){
    yield takeEvery('CREATE_GROUP_NOTIFICATION', mutationCreateGroupNotificationFunction)
  }  

// ----------------------------------------------- 
// ----------------------------------------------- 

const Put_CreateContact = gql`
mutation createaContact ($userid: String!, $useremail: String!, $userfirstName: String!, $userlastName: String!, $contactid: String!, $contactemail: String!, $contactfirstName: String, $contactlastName: String! ){
  createContact( input: {
      userid: $userid,
      useremail: $useremail,
      userfirstName: $userfirstName,
      userlastName: $userlastName,
      contactid: $contactid,
      contactemail: $contactemail,
      contactfirstName: $contactfirstName,
      contactlastName: $contactlastName
  }) {
      user {
          identification
          email
          contacts {
              id
              room
              email
              firstName
              lastName
          }
      }
      contact {
          identification
          email
      }
      number
  }
}
`
;
function putCreateContactFunction (userid, useremail, userfirstName, userlastName, contactid, contactemail, contactfirstName, contactlastName){
  const result = client.mutate({
    mutation: Put_CreateContact,
    variables: {userid: userid, useremail:useremail, userfirstName:userfirstName, userlastName:userlastName, contactid:contactid, contactemail:contactemail, contactfirstName:contactfirstName, contactlastName:contactlastName}
  })
  return result
}
  function* mutationCreateContactFunction(action) {
    console.log('action.userid, action.useremail, action.userfirstName, action.userlastName, action.contactid, action.contactemail, action.contactfirstName, action.contactlastName: ', action.userid, action.useremail, action.userfirstName, action.userlastName, action.contactid, action.contactemail, action.contactfirstName, action.contactlastName);
    const { data } = yield call(putCreateContactFunction, action.userid, action.useremail, action.userfirstName, action.userlastName, action.contactid, action.contactemail, action.contactfirstName, action.contactlastName);

    function addNewChat(contact){
      let room=contact.room;
      let users=[{id:action.userid, userName:action.userfirstName + ' ' +action.userlastName, src:'' },{id:contact.id, userName:contact.firstName + ' ' +contact.lastName, src:'' }];
      let messages=[];
      let contactRoom={
          room:room, 
          users:users,
          messages:messages
      }
      return contactRoom;
  }

    let contactData=data.createContact.user.contacts;
    let contactId=data.createContact.contact.identification;

    let newRoom = contactData.filter(function (el){
         return el.id == contactId;
    });

    let rooms=[];
    let addedRoom={
          id:newRoom[0].id,
          room:newRoom[0].room
    }

    let chat=[];
    chat= chat.concat(addNewChat(newRoom[0])); 

    let messages=[];
    yield put(addRooms(addedRoom));
    yield put(updateContacts(contactData));
    // yield put(addNewContactMessage(chat));
    yield put(addNewContactMessage(addNewChat(newRoom[0])));
    yield put(updateNotifications(data.createContact.number));      
          
  
  }  

  function* mutationCreateContact(action){
    console.log('action: ', action)
    yield takeEvery('CREATE_CONTACT', mutationCreateContactFunction)
  }  

// ----------------------------------------------- 
// ----------------------------------------------- 

const Put_DeleteNotification = gql`
mutation deleteNotification ($userid: String!, $contactid: String!){
  deleteNotification( input: {
       userid: $userid,
     contactid: $contactid
}) {
    number
  } 
}
`
;
function putDeleteNotificationFunction (userid, contactid){
  const result = client.mutate({
    mutation: Put_DeleteNotification,
    variables: {userid: userid, contactid:contactid}
  })
  return result
}
  function* mutationDeleteNotificationFunction(action) {
    const { data } = yield call(putDeleteNotificationFunction, action.userid, action.contactid);
    console.log('mutationDeleteNotificationFunction data: ', data);
    yield put(updateNotifications(data.deleteNotification.number));
  }  

  function* mutationDeleteNotification(action){
    yield takeEvery('DELETE_NOTIFICATION', mutationDeleteNotificationFunction)
  }  

// ----------------------------------------------- 
// ----------------------------------------------- 

const Put_DeleteGroupNotification = gql`
mutation deleteGroupNotification ($id: String!, $email: String!, $room: String!){
  deleteGroupNotification( input: {
       id: $id,
     email: $email
         room: $room
}) {
    number
  } 
}
`
;
function putDeleteGroupNotificationFunction (id, email, room){
  const result = client.mutate({
    mutation: Put_DeleteGroupNotification,
    variables: {id: id, email:email, room:room}
  })
  return result
}
  function* mutationDeleteGroupNotificationFunction(action) {
    const { data } = yield call(putDeleteGroupNotificationFunction, action.id, action.email, action.room );
    console.log('data: ', data);
    yield put(updateGroupNotifications(data.deleteGroupNotification.number));
  }  

  function* mutationDeleteGroupNotification(action){
    yield takeEvery('DELETE_GROUP_NOTIFICATION', mutationDeleteGroupNotificationFunction)
  }  

// ----------------------------------------------- 

// ----------------------------------------------- 

const Put_CreateGroup = gql`
mutation createGroup($id: String, $email: String, $room: String, $input: [newmember] ) {
  createGroup( input: {
      id: $id,
      email: $email,
      group:
              {
                 room: $room,
                 members: $input
             }
}) {
     room
         members{
         id
         email
         firstName
         lastName
     }
 }
}
`
;
function putCreateGroupFunction (id, email, room, input){
  const result = client.mutate({
    mutation: Put_CreateGroup,
    variables: {id: id, email: email, room: room, input: input}
  })
  return result
}
  function* mutationCreateGroupFunction(action) {
    const { data } = yield call(putCreateGroupFunction, action.id, action.email, action.room, action.input );
    console.log('data: ', data);

    yield put(updateGroups(data.createGroup));
    let len=data.createGroup.length;

    let newRoom={
        id: data.createGroup[len-1].room,
        room: data.createGroup[len-1].room
    }

    yield put(addRooms(newRoom));
    yield put(eliminateGroupNotification());


    function addNewGroupChat(group){
        let room=group.room;
        let users=group.members;
        let messages=[];
        let contactRoom={
            room:room, 
            users:users,
            messages:messages
        }
        return contactRoom;
    }

  let group=data.createGroup[len-1];
   
  yield put(addNewContactMessage(addNewGroupChat(group)));
      
  }  

  function* mutationCreateGroup(action){
    yield takeEvery('CREATE_GROUP', mutationCreateGroupFunction)
  }  

// ----------------------------------------------- 


export default function* rootSaga() {
    yield all([
      queryUser(),
      queryContact(),
      queryLogIn(),
      mutationSignUp(),
      queryNotification(),
      queryGroupNotification(),
      mutationCreateNotification(),
      mutationCreateGroupNotification(),
      mutationCreateContact(),
      mutationDeleteNotification(),
      mutationDeleteGroupNotification(),
      mutationCreateGroup()
    ])
  }
