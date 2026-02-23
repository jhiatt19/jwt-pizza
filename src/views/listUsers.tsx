import React from "react";
import { useLocation } from "react-router-dom";
import { useBreadcrumb } from "../hooks/appNavigation";
import { pizzaService } from "../service/service";
import View from "./view";
import Button from "../components/button";

export default function ListUsers() {
  const navigateToParent = useBreadcrumb();

  async function close() {
    navigateToParent();
  }
  return (
    <View title="Users">
      <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-neutral-100">
          Are you sure you want to close the{" "}
          <span className="text-orange-500">{}</span> store{" "}
          <span className="text-orange-500">{}</span> ? This cannot be restored.
          All outstanding revenue will not be refunded.
        </div>
        <Button title="Close" onPress={close} />
      </div>
    </View>
  );
}
