import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5000/notificationHub")
    .configureLogging(LogLevel.Information)
    .build();

export function startSignalRConnection() {
    connection
        .start()
        .then(() => console.log("SignalR connected"))
        .catch((err) => console.error("SignalR connection error:", err));
}

export function onReceiveNewTicket(callback) {
    connection.on("ReceiveNewTicket", callback);
}

export function onReceiveStatusChange(callback) {
    connection.on("ReceiveStatusChange", callback);
}

export default connection;
