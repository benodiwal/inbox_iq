import { $Enums } from "@prisma/client";

export type EmailJob = {
    emailId: string;
    messageId: string;
    platform: $Enums.Platform,
};

export type category = 'INTERESTED' | 'NOT_INTERESTED' | 'MORE_INFORMATION';
