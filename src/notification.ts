const NOTIFICATION_TITLE = "新消息";
const NOTIFICATION_BODY =
  "Notification from the Renderer process. Click to log to console.";
const CLICK_MESSAGE = "消息已读!";

type NotificationHelperFunction = {
  title?: string;
  body?: string;
}

function showNotification(props?: NotificationHelperFunction) {
  const {
    title = NOTIFICATION_TITLE,
    body = NOTIFICATION_BODY,
  } = props || {};
  new Notification(title, { body }).onclick =
    () => console.log(CLICK_MESSAGE);
}

export {
  showNotification
}