import React, { useState, useEffect } from "react";
import { getTickets, createTicket } from "../services/api";
import Ticket from "./Ticket";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPanel = () => {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: "Low" });
    const [connection, setConnection] = useState(null);

    // Konfiguracja SignalR
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5000/notificationHub") // Adres SignalR
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("SignalR Connected.");

                    // Odbieranie nowego zgłoszenia
                    connection.on("ReceiveNewTicket", (ticket) => {
                        setTickets((prevTickets) => [...prevTickets, ticket]);
                    });

                    // Odbieranie zmiany statusu
                    connection.on("ReceiveStatusChange", (ticketId, newStatus) => {
                        setTickets((prevTickets) =>
                            prevTickets.map((ticket) =>
                                ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
                            )
                        );
                    });
                })
                .catch((error) => console.error("SignalR Connection Error:", error));
        }
    }, [connection]);

    // Obsługa odświeżania zgłoszeń co 5 sekund
    useEffect(() => {
        const interval = setInterval(() => {
            async function fetchTickets() {
                try {
                    const tickets = await getTickets();
                    setTickets(tickets);
                } catch (error) {
                    console.error("Failed to fetch tickets:", error);
                }
            }
            fetchTickets();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleCreateTicket = async () => {
        try {
            const createdTicket = await createTicket(newTicket);
            setTickets([...tickets, createdTicket]);
            setNewTicket({ title: "", description: "", priority: "Low" });

            // Nowe: Wysyłanie informacji o utworzonym zgłoszeniu przez SignalR
            if (connection) {
                connection.invoke("SendNewTicketNotification", createdTicket)
                    .catch((err) => console.error("SignalR Invoke Error:", err));
            }

            toast.success("Ticket created successfully!");
        } catch (error) {
            console.error("Failed to create ticket:", error);
            toast.error("Failed to create ticket.");
        }
    };

    return (
        <div className="container">
            <h2>User Panel</h2>
            <div>
                <h3>Create Ticket</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
                <label htmlFor="priority-select">Set Priority:</label>
                <select
                    id="priority-select"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button onClick={handleCreateTicket}>Create Ticket</button>
            </div>
            <div>
                <h3>My Tickets</h3>
                {tickets.map((ticket) => (
                    <Ticket key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
};

export default UserPanel;
