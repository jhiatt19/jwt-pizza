import React, { useEffect, useState } from "react";
import { useBreadcrumb } from "../hooks/appNavigation";
import { pizzaService } from "../service/service";
import View from "./view";
import Button from "../components/button";
import { TrashIcon } from "../icons";
import { ListUsers, Role, User } from "../service/pizzaService";

export default function ListUsers() {
  const navigateToParent = useBreadcrumb();
  const [users, setUsers] = useState<ListUsers>({
    users: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

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

  async function deleteANDrefresh(user: User) {
    const result = await pizzaService.deleteUser(user);
    const refresh = await pizzaService.getUsers();
    setUsers(refresh);
  }
  const currentRecords = users?.users?.slice(firstIndex, lastIndex) || [];
  const nPages = Math.ceil((users.users?.length || 0) / recordsPerPage);
  return (
    <View title="">
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white border border-gray-200 shadow-sm">
        <h2
          className="text-xl font-bold mb-4 text-gray-800 text-center"
          data-testid="table-testy"
        >
          Users
        </h2>
        <table className="w-full text-center">
          <thead className="uppercase border-b-2 border-gray-100 text-left font-bold text-gray-800">
            <tr>
              {["Name", "Email", "Role", "Delete"].map((header) => (
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
          <tbody className="divide-y divide-gray-50 hover:bg-gray50">
            {currentRecords.map((user, index) => (
              <tr key={user.id || index} className="divide-y divide-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.roles?.[0].role ?? "No Role"}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                  <button
                    type="button"
                    className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400  hover:border-orange-800 hover:text-orange-800"
                    onClick={async () => await deleteANDrefresh(user)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button title="Back" onPress={close} />
        <Button
          title="Prev Page"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        <Button
          title="Next Page"
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, nPages))}
        />
      </div>
    </View>
  );
}
