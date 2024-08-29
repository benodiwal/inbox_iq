import { $Enums } from "@prisma/client";

export type EmailJob = {
    emailId: string;
    messageId: string;
    platform: $Enums.Platform,
};

export type EmailContent = {
    subject: string;
    body: string;
};

export type category = 'INTERESTED' | 'NOT_INTERESTED' | 'MORE_INFORMATION';
