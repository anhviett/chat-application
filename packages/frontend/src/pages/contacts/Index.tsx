import AllContact from "@/features/contact/components/AllContact";
import HeaderSection from "@/common/components/HeaderSection";
import SearchSection from "@/common/components/SearchSection";

const Contact = () => {

  return (
    <>
      <div className="chat-search-header relative mb-4">
        <HeaderSection title="Contacts" />

        {/* Search Box */}
        <SearchSection />

        {/* Chat Tabs */}
        <div className="chat-tabs">
          <AllContact />
        </div>
      </div>
    </>
  );
};

export default Contact;
