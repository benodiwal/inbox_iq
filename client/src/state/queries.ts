import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosClient from "./http";
import { Account, User } from "@/types/User";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Email } from "@/types/Email";

type UserResponse = {
    result: User;
}

type UserAccountsResponse = {
    result: Account[]
}

type EmailResponse = {
    result: Email[]
}

export const useGetUser = () => {
    const query = useQuery<User, AxiosError>({
        queryKey: ["user"],
        queryFn: () => AxiosClient.get<UserResponse>("/user").then((data) => data.data.result),
        retry: 1,
    });
    return query;
}

export const useGetUserAccounts = () => {
    const query = useQuery<Account[], AxiosError>({
        queryKey: ["accounts"],
        queryFn: () => AxiosClient.get<UserAccountsResponse>("/user/accounts").then((data) => data.data.result),
        retry: 1,
    });
    return query;
}

export const useEmails = (accountId: string) => {
    const query = useQuery<Email[], AxiosError>({
        queryKey: ["emails"],
        queryFn: () => AxiosClient.get<EmailResponse>(`/email/${accountId}`).then((data) => data.data.result),
        retry: 1,
    });
    return query;
}

export const useLogOut = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mut = useMutation({
    mutationKey: ["user"],
    mutationFn: () => AxiosClient.get("/user/logout"),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user"] })
      navigate("/")
    },
  })
  return mut
}
