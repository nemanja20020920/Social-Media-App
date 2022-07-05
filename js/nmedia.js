let session = new Session();
let session_id = session.getSession();

if(session_id === '') window.location.href = '/';

