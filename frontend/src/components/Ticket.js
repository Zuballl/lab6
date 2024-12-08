import React, { useState } from "react";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const Ticket = ({ ticket, onUpdateStatus, onAddComment }) => {
    const [selectedStatus, setSelectedStatus] = useState(ticket.status); // Aktualny status
    const [comment, setComment] = useState(""); // Obsługa wpisanego komentarza

    const handleStatusChange = () => {
        if (onUpdateStatus && selectedStatus !== ticket.status) {
            onUpdateStatus(ticket.id, selectedStatus);
        }
    };

    const handleAddComment = () => {
        if (onAddComment && comment.trim()) {
            onAddComment(ticket.id, comment); // Wywołanie funkcji dodania komentarza
            setComment(""); // Wyczyść pole tekstowe po dodaniu komentarza
        } else {
            alert("Comment cannot be empty!"); // Komunikat dla pustego komentarza
        }
    };

    return (
        <div className="ticket">
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>
            <p>Created At: {formatDate(ticket.createdAt)}</p>
            <p>Updated At: {formatDate(ticket.updatedAt)}</p>

            {/* Wyświetlanie listy komentarzy */}
            {ticket.comments && ticket.comments.length > 0 && (
                <div className="comments">
                    <h4>Comments:</h4>
                    <ul>
                        {ticket.comments.map((comment, index) => (
                            <li key={index}>
                                {comment.content} - <em>{formatDate(comment.createdAt)}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Zmiana statusu zgłoszenia */}
            {onUpdateStatus && (
                <div>
                    <label htmlFor={`status-select-${ticket.id}`}>Change status:</label>
                    <select
                        id={`status-select-${ticket.id}`}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="status-select"
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <button onClick={handleStatusChange} className="update-button">
                        Update Status
                    </button>
                </div>
            )}

            {/* Dodawanie komentarza */}
            {onAddComment && (
                <div>
                    <textarea
                        placeholder="Add a comment"
                        value={comment} // Powiązanie z lokalnym stanem
                        onChange={(e) => setComment(e.target.value)} // Obsługa wpisywania tekstu
                    ></textarea>
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            )}
        </div>
    );
};

export default Ticket;
