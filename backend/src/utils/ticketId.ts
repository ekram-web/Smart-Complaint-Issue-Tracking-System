// Generate unique ticket ID (e.g., ASTU-2024-001)
import prisma from '../config/database';

export const generateTicketId = async (): Promise<string> => {
  // Get current year
  const year = new Date().getFullYear();

  // Count how many tickets exist this year
  const count = await prisma.ticket.count({
    where: {
      ticketId: {
        startsWith: `ASTU-${year}-`, // Tickets starting with "ASTU-2024-"
      },
    },
  });

  // Generate ID with zero-padded number (001, 002, 003...)
  const number = (count + 1).toString().padStart(3, '0');
  
  // Return: ASTU-2024-001
  return `ASTU-${year}-${number}`;
};
