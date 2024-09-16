
var userlist = {
    Admin: {
        username: `max.bisesi@learnordie.com`, // IP range must be in trusted IP ranges.
        password: `l-cs8npCqppef`,
        loginUrl: `https://login.salesforce.com/`,
        profile: 'System Administrator'
    },
};

export {userlist};

export default function getUser(user) {
    //logger(`   getUser() ${user}`);
    var target = {
        'name':user,
        'restRoot':`/services/data`,
    };
    return Object.assign(target,userlist[user]);
}
