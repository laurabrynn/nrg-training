export const metadata = {
  title: "Junebug Steps of Service | NRG Training",
};

const steps = [
  {
    number: 1,
    title: "Greeting",
    content: [
      "The host, maître d', or first available staff member seats the guests and places menus on the table. All staff should be prepared to seat guests.",
      "Make eye contact and greet every guest as they make their way to the table. Allow guests the right of way at all times.",
      "The server approaches the table within one minute. If unable to do so, another server, manager, or support staff will approach.",
      "Introduction: \"Welcome to Junebug, thank you for joining us today/this evening. My name is ______ and I'll be taking care of you this evening.\"",
      "Pour still water from a swing-top bottle clockwise around the table.",
      "While pouring, introduce the food menu — note the categories (snacks, smalls, mains) and the ability to bundle items to try more. Mention the beverage menu: full-strength and NA cocktails, sustainable wines, small-batch draft beers.",
      "The menu book indicates the table has been greeted.",
    ],
  },
  {
    number: 2,
    title: "Second Visit — Drinks",
    content: [
      "Create conversation around the beverage order. Some guests will be ready, others won't — keep the conversation open for both and be direct and specific about what you'd encourage them to enjoy.",
      "If the guest is ready to order drinks, take the order promptly and prioritize getting it into the POS.",
      "Drinks should be on the table within 10 minutes of the guest being seated — this means entering the order within the first 5 minutes. The grace given by the guest is lowest at the beginning and end of their meal.",
      "Once drinks are ordered, turn the guest's attention to the food menu before leaving, and mention you'll return to talk food in a few minutes. If they'd like to order food now, that works too.",
      "This is the ideal time to mention any specials. Example: \"Great, I will be right back with your cocktails and wine. Before I go, I'd like to tell you about our special today — Chef has prepared a ______.\"",
    ],
  },
  {
    number: 3,
    title: "Third Visit — Food Order",
    content: [
      "Return with drinks on a tray. Confidently and clearly tell the guest what you are placing in front of them.",
      "Drinks, like food, are assigned by seat number and are never auctioned off at the table. Know where they are going and ring them in as such so colleagues can also deliver confidently.",
      "Open a conversation about the menu — find ways to personalize \"Do you have any questions about the menu?\" to your style.",
      "Ask about dietary restrictions before making suggestions. Guide the guest toward what you believe is the best experience available.",
      "Know your menu. Study descriptions and ask the chefs for clarity whenever you need to. This leads to success in selling, raising the check average, and your tip.",
    ],
  },
  {
    number: 4,
    title: "Taking the Order",
    content: [
      "Take the order and repeat it back to the guest naturally — do it without them really knowing you're doing it. Example: \"That sounds great! I'll place the order for your MR steak and your salmon with sauce on the side.\"",
      "Before leaving the table, confirm any dietary restrictions or allergies that haven't been mentioned.",
      "If a guest has a special request, ask the kitchen. Note all allergies in the POS even if the item doesn't contain the ingredient of concern.",
      "Place the order in the POS by seat number. Double-check every guest's food — count the entrées!",
      "Organize and understand all special instructions before placing the order.",
    ],
  },
  {
    number: 5,
    title: "Table Maintenance & Mis En Place",
    content: [
      "As guests receive and finish snacks/smalls, be aware of what needs to be cleared. If someone else has cleared silverware a guest still needs, notice it and replace it.",
      "Keep beverages full. Water glasses should be refilled as you move around the dining room.",
      "Cocktails and wine glasses that are half empty should prompt an offer of another round.",
      "Never clear anything from a table without asking: \"May I clear this ____?\"",
      "Anticipate when your tables' food is going to be ready. Ask yourself: what does my guest need to be 100% ready to enjoy this dish when it arrives? A guest should never receive a dish without the tools to enjoy it.",
    ],
  },
  {
    number: 6,
    title: "Food Delivery & Recall",
    content: [
      "Food is delivered by seat number as it was rung in. When you have food in hand, you should know exactly who it goes in front of — this is very important.",
      "When delivering food, take an inventory: does the guest have the correct plateware, silverware, and condiments? Do they need beverages or water?",
      "This should be done consciously but unbeknownst to the guest as you set the food down.",
      "If you notice something specific, ask: \"I'll be right back with more water — is there anything else I can bring?\" If you don't notice anything missing, still ask. Give the guest the opportunity to take their own inventory.",
      "If a guest needs something, this takes priority over everything else. If you can't do it yourself, delegate to a colleague or manager immediately.",
    ],
  },
  {
    number: 7,
    title: "Hospitality By Walking Around",
    content: [
      "Make efficient use of your time. There is always something to do — help a teammate or prepare for the next crunch. Run drinks, run food, seat guests, keep service areas clean.",
      "If your guests are well prepared, ask a teammate what they need.",
      "Service task priorities (in descending order):",
      "① Greet a table → ② Take a drink or food order → ③ Run food or drinks → ④ Fill drinks / offer another round → ⑤ Clear a table → ⑥ Run payment → ⑦ Mark a table for next course → ⑧ Deliver a check → ⑨ Reset a table",
      "Idle time is also a valuable opportunity to create light conversation and make a personal connection with guests.",
    ],
  },
  {
    number: 8,
    title: "Clearing & Dessert",
    content: [
      "Clear only when everyone has finished their meal, or if a guest has actively pushed the dish away. No stacking! Use a tray. Ask for help if you need it.",
      "After clearing entrées, only water glasses and beverages guests are still enjoying should remain on the table.",
      "After crumbing and cleaning the table, return with a dessert menu for each guest. Describe your favorite dessert items and after-dinner drinks.",
      "Offer coffee or tea before leaving the guest to deliberate — doing this now allows sufficient time for preparation.",
      "Dessert drinks and food should be ordered and delivered the same way as dinner.",
    ],
  },
  {
    number: 9,
    title: "Offering the Check",
    content: [
      "Once the table is completely cleared of all dessert plateware and silver, ask if the table would like anything else.",
      "Once they decline, drop the check — thank the guests warmly (and by name if possible!) for joining you.",
      "Deliver a printed copy of the check in a book. Once payment is provided, make processing it a top priority.",
      "We have the smallest amount of guest grace at the beginning and end of the meal. Move with urgency.",
    ],
  },
  {
    number: 10,
    title: "Guest Departure",
    content: [
      "All available staff should bid farewell to guests as they leave, thanking them for choosing to dine with us.",
      "Do not remove the check from the table before guests have left.",
    ],
  },
];

export default function StepsOfServicePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nrg-charcoal">
          Junebug Steps of Service
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Our hospitality philosophy — from the moment a guest walks in to the moment they leave.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-nrg-green text-white text-sm font-bold flex items-center justify-center">
                {step.number}
              </span>
              <h2 className="font-semibold text-nrg-charcoal">{step.title}</h2>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {step.content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-nrg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
