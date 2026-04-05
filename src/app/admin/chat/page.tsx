import ChatClient from "@/app/manager/chat/ChatClient";

export const metadata = { title: "Ask NRG | NRG Training" };

export default function AdminChatPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Ask NRG</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ask anything about NRG policies, procedures, or best practices.
        </p>
      </div>
      <ChatClient />
    </div>
  );
}
