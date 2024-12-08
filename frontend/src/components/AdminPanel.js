import React, { useState, useEffect } from "react";
import { getTickets, updateTicketStatus, addComment } from "../services/api";
import Ticket from "./Ticket";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPanel = () => {
    const [tickets, setTickets] = useState([]);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const tickets = await getTickets();
                setTickets(tickets);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        }

        fetchTickets();

        // Konfiguracja połączenia SignalR
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5000/notificationHub") // Adres SignalR
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("SignalR Connected.");

                    // Obsługa powiadomień SignalR
                    connection.on("ReceiveNewTicket", (ticket) => {
                        toast.success(`New ticket created: ${ticket.title}`);
                        setTickets((prevTickets) => [...prevTickets, ticket]);
                    });

                    connection.on("ReceiveStatusChange", (ticketId, newStatus) => {
                        setTickets((prevTickets) =>
                            prevTickets.map((ticket) =>
                                ticket.id === ticketId
                                    ? { ...ticket, status: newStatus, updatedAt: new Date() }
                                    : ticket
                            )
                        );
                        toast.info(`Status updated for Ticket ID: ${ticketId} to ${newStatus}`);
                    });

                    connection.on("ReceiveNewComment", (ticketId, comment) => {
                        setTickets((prevTickets) =>
                            prevTickets.map((ticket) =>
                                ticket.id === ticketId
                                    ? { ...ticket, comments: [...ticket.comments, comment], updatedAt: new Date() }
                                    : ticket
                            )
                        );
                        toast.success(`New comment added to Ticket ID: ${ticketId}`);
                    });
                })
                .catch((error) => console.error("SignalR Connection Error:", error));
        }

        // Czyszczenie połączenia przy odmontowaniu komponentu
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateTicketStatus(id, status);

            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === id ? { ...ticket, status, updatedAt: new Date() } : ticket
                )
            );
        } catch (error) {
            console.error("Failed to update ticket status:", error);
        }
    };

    const handleAddComment = async (id, content) => {
        if (!content.trim()) {
            toast.error("Comment cannot be empty!");
            return;
        }

        try {
            const updatedTicket = await addComment(id, { content });

            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket.id === id ? updatedTicket : ticket
                )
            );
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment.");
        }
    };

    return (
        <div className="container">
            <ToastContainer />
            <h2>Admin Panel</h2>
            <div>
                {tickets.length === 0 ? (
                    <p>No tickets available</p>
                ) : (
                    tickets.map((ticket) => (
                        <Ticket
                            key={ticket.id}
                            ticket={ticket}
                            onUpdateStatus={handleUpdateStatus}
                            onAddComment={handleAddComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
