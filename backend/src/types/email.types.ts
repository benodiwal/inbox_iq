import { $Enums } from "@prisma/client";

export type EmailJob = {
    emailId: string;
    accountId: string;
    platform: $Enums.Platform,
};


export type category = 'INTERESTED' | 'NOT_INTERESTED' | 'MORE_INFORMATION';
