const { makeExecutableSchema}= require('@graphql-tools/schema');
const resolvers = require('./resolvers');

const typeDefs = `
    type LoginResponse {
        user: User
        token: String
        contact: UserContact
        notification: UserNotification
        groupnotification: [GroupNotification]
        group: [Group]
    }

    type CreateContactResponse {
        user: UserContact
        contact: UserContact
        number: Int
    }

    type DeleteNotificationResponse {
        number: Int
    }

    type User {
        _id: ID
        email:String
        firstName: String
        lastName: String
        tokens: [Token]
    }
    type Token {
        token:String
    }

    type UserGroupNotification {
        identification: ID
        email:String
        notifications: [GroupNotification]
    }
    type GroupNotification {
        room: String
        members: [member]
    }
    type member {
        id: String
        email: String
        firstName: String
        lastName: String
        _id: ID
    }

    type UserGroup {
        identification: ID
        email:String
        groups: [Group]
    }
    type Group {
        room: String
        members: [member]
    }

    type UserNotification {
        _id: ID
        email:String
        notifications: [Notification]
    }
    type Notification {
        id: String
        email: String
        firstName: String
        lastName: String
        _id: ID
    }

    type UserContact {
        identification: ID
        email:String
        contacts: [Contact]
    }    
    type Contact {
        id: String
        room: String
        email: String
        firstName: String
        lastName: String
    }

    input UserInput {
        email:String
        password: String
        firstName: String
        lastName: String
    }

    input NotificationInput {
        identification:String
        email: String
        id: String
        useremail: String
        firstName: String
        lastName: String
    }

    input deleteNotificationInput {
        userid:String
        contactid: String
    }

    input deleteGroupNotificationInput {
        id:String
        email: String
        room:String
    }

    input LoginInput {
        email:String
        password: String
    }

    input ContactInput {
        userid:String
        useremail: String
        userfirstName: String
        userlastName: String
        contactid: String
        contactemail: String
        contactfirstName: String
        contactlastName: String
    }

    input GroupInput {
        id: String
        email: String
        group: NewGroup
    }
    input NewGroup {
        room: String
        members: [newmember]
    }
    input newmember {
        id: String
        email: String
        firstName: String
        lastName: String
    }

    type Query {
        createLogin(input: LoginInput): LoginResponse
        user(email: String!): User
        contacts(id: String!): UserContact
        notifications(id: String!): UserNotification
        groupnotifications(id: String!): [GroupNotification]
        groups(id: String!): [Group]
    }

    type Mutation {
        createUser(input: UserInput): User
        createNotification(input: NotificationInput): Notification
        deleteNotification(input: deleteNotificationInput): DeleteNotificationResponse
        deleteGroupNotification(input: deleteGroupNotificationInput): DeleteNotificationResponse
        createContact(input: ContactInput): CreateContactResponse 
        createGroup(input: GroupInput): [Group]    
        createGroupAndNotifications(input: GroupInput): [Group]
    }

`;

const schema= makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
});

module.exports = schema;