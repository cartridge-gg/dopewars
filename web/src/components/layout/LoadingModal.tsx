import { Dialog, Transition } from "@headlessui/react";
import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { Loader } from "./Loader";

export const LoadingModal = observer(() => {
  const [isLoading, _setIsLoading] = useState(false);

  return (
    <Transition appear show={isLoading} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-neon-900 max-w-[360px] p-6">
                <div className="flex flex-col items-center w-full gap-6">
                  <Loader text="LOADING ASSETS ..." />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});
