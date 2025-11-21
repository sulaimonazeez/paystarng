import NavBar from "../components/layout/navbar.jsx";
import { ThemeContext } from "../context/ThemeContext";
import vtu from "../assets/vtu.jpg";
import data from "../assets/data.jpg";
import bill from "../assets/bills.jpg";
import airtime from "../assets/a2c.jpg";
import retailer from "../assets/retailer_website.jpg";
import { useContext } from "react";
import Main from "../components/layout/main.jsx";
import HomeCard from "../components/home/card.jsx";
import Choose from "../components/home/why-choose.jsx";
import Channel from "../components/home/channel.jsx";
import Comment from "../components/home/comments.jsx";
import Documentaion from "../components/home/documentation.jsx";
import Footer from "../components/home/footer.jsx";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Buy cheap data and airtime instantly." />
      </Helmet>
    <div className={theme === "light" ? "bg-slate-100 min-h-screen" : "bg-black min-h-screen"}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      <div className="mt-16 px-3 md:px-10 lg:px-20">
        {/* Main Section */}
        <div className="max-w-6xl mx-auto">
          <Main theme={theme} />
        </div>

        <div className="mt-10 md:mt-24 md:mb-0 md:px-0 md:py-0 grid grid-cols-1 md:grid-cols-2 items-start">
        <HomeCard
          theme={theme}
          image={data}
          heading="Data Plan"
          text="Get Internet Data starting from as low as ₦220/GB"
        />
        <HomeCard
          image={vtu}
          heading="Airtime Top-up"
          text="Recharge any network instantly at the best rate"
        />
      </div>
      <div className="md:flex justify-center">
         <HomeCard
          image={bill}
          heading="Airtime Top-up"
          text="Recharge any network instantly at the best rate"
        />
      </div>
      <div className="md:mx-0 md:mt-0 md:mb-0 md:px-0 md:py-0 grid grid-cols-1 md:grid-cols-2 items-start">
        <HomeCard
          image={airtime}
          heading="Data Plan"
          text="Get Internet Data starting from as low as ₦220/GB"
        />
        <HomeCard
          image={retailer}
          heading="Airtime Top-up"
          text="Recharge any network instantly at the best rate"
        />
      </div>
      </div>
      <Choose theme={theme} />
      <Channel theme={theme} />
      <Comment theme={theme}/>
      <Documentaion />
      <Footer />
    </div>
    </div>
  );
};

export default Home;