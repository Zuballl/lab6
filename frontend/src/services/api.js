const API_BASE_URL = "http://localhost:5000/api";

/**
 * Pobiera wszystkie zgłoszenia z backendu.
 */
export async function getTickets() {
    const response = await fetch(`${API_BASE_URL}/ticket`);
    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }
    return response.json();
}

/**
 * Tworzy nowe zgłoszenie.
 * @param {Object} ticket - Obiekt zgłoszenia (title, description, priority).
 */
export async function createTicket(ticket) {
    const response = await fetch(`${API_BASE_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
    });

    if (!response.ok) {
        throw new Error("Failed to create ticket");
    }

    return response.json();
}

/**
 * Aktualizuje zgłoszenie.
 * @param {number} id - ID zgłoszenia.
 * @param {Object} updatedTicket - Zaktualizowane dane zgłoszenia.
 */
export async function updateTicket(id, updatedTicket) {
    const response = await fetch(`${API_BASE_URL}/ticket/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTicket),
    });

    if (!response.ok) {
        throw new Error("Failed to update ticket");
    }

    return response.json();
}

/**
 * Dodaje komentarz do zgłoszenia.
 * @param {number} ticketId - ID zgłoszenia.
 * @param {Object} comment - Obiekt komentarza (content).
 */
export async function addComment(ticketId, comment) {
    const response = await fetch(`${API_BASE_URL}/ticket/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        throw new Error("Failed to add comment");
    }

    return response.json(); // Zwracamy zaktualizowane zgłoszenie
}

/**
 * Aktualizuje status zgłoszenia.
 * @param {number} id - ID zgłoszenia.
 * @param {string} status - Nowy status zgłoszenia (Open, In Progress, Closed).
 */
export async function updateTicketStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/ticket/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status),
    });

    if (!response.ok) {
        throw new Error("Failed to update ticket status");
    }

    return response.json();
}


