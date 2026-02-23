import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBreadcrumb } from "../hooks/appNavigation";
import { pizzaService } from "../service/service";
import View from "./view";
import Button from "../components/button";
import { TrashIcon } from "../icons";
import { ListUsers } from "../service/pizzaService";

export default function ListUsers() {
  const navigateToParent = useBreadcrumb();
  const [users, setUsers] = useState<ListUsers>({ users: [] });

  async function close() {
    navigateToParent();
  }

  useEffect(() => {
    const gettingUsers = async () => {
      const data = await pizzaService.getUsers();
      console.log(data);
      setUsers(data);
    };
    gettingUsers();
  }, []);
  return (
    <View title="Users">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
          <tr>
            {["Name", "Email", "Role", "Delete?"].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {users.users.map((user, index) => (
          <tbody key={user.id || index} className="divide-y divide-gray-200">
            <tr className="border-neutral-500 border-t-2">
              <td className="text-start px-2 whitespace-nowrap text-l font-mono text-orange-600">
                {user.name}
              </td>
              <td
                className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800"
                colSpan={3}
              >
                {user.email}
              </td>
              <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800">
                {user.roles?.[0].role ?? "No Role"}
              </td>
              <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                <button
                  type="button"
                  className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400  hover:border-orange-800 hover:text-orange-800"
                  onClick={() => pizzaService.deleteUser(user)}
                >
                  <TrashIcon />X
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <Button title="Close" onPress={close} />
    </View>
  );
}
