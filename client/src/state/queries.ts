import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosClient from "./http";
import { User } from "@/types/User";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type UserResponse = {
    result: User;
}

export const useGetUser = () => {
    const query = useQuery<User, AxiosError>({
        queryKey: ["user"],
        queryFn: () => AxiosClient.get<UserResponse>("/user").then((data) => data.data.result),
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