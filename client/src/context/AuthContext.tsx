import { useGetUser } from "@/state/queries";
import { FC, ReactNode } from "react"
import Login from "@/components/Login";
import Loading from "@/components/shared/Loading";
import SomethingWentWrong from "@/components/shared/SomethingWentWrong";

const AuthContext: FC<{ children: ReactNode }> = ({ children }) => {
    const { isLoading, isError, data, error } = useGetUser();
    if (isLoading) return <Loading />;

    if (isError && (!error.response || error.response.status !== 401)) return <SomethingWentWrong />;

    if (!isLoading && !data) return <Login />;
    return <>{children}</>;
}

export default AuthContext
