import { $Enums } from "@prisma/client";

export type EmailJob = {
    emailId: string;
    accountId: string;
    platform: $Enums.Platform,
};
