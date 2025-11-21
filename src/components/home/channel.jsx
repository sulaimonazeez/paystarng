import React from "react";
import { Globe } from 'lucide-react';
import { Smartphone } from 'lucide-react';
import WebBox from "../ui/webBox.jsx";
import { Code } from 'lucide-react';
import { Mail } from 'lucide-react';
import { MailOpen } from 'lucide-react';
import { PhoneCall } from 'lucide-react';
const Channel = ({theme}) =>{
  return (
    <div className="md:px-20 mt-7">
      <div className="p-4">
        <p className="text-1xl font-sans text-gray-500 font-bold">OUR CHANNELS</p>
        <h6 className={theme==="light" ? "mt-2 text-2xl text-blue-950 mb-4 font-bold" : "mt-2 text-2xl text-white mb-4 font-bold"}>Connect with us through several channels</h6>
        <div>
          <p className="text-1xl text-gray-500 font-sans">We have several channels you can choose to connect and make transactions on our platform, from our Website to Mobile App, API, USSD, SMS and our Powerful Whatsapp Bot.</p>
      </div>
      <div className="grid grid-cols-2 justify-center gap-4 mt-7">
        <WebBox theme={theme} text="Website" icon={Globe}/>
        <WebBox theme={theme} text="Mobile App" icon={Smartphone}/>
        <WebBox theme={theme} text="API" icon={Code}/>
        <WebBox theme={theme} text="USSD" icon={Mail}/>
        <WebBox theme={theme} text="SMS" icon={MailOpen}/>
        <WebBox theme={theme} text="Mobile App" icon={PhoneCall}/>
      </div>
    </div>
    </div>
  )
}

export default Channel;