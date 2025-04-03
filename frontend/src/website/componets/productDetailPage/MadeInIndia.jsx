export default function MadeInIndia({global_tagline,name , cas}) {
    return (
      <div className="mt-8 border rounded-lg p-4 bg-orange-500/10 border-orange-600 flex justify-center items-center gap-4">
        <div className="w-16">
          <img
            src="https://img.freepik.com/free-vector/illustration-india-flag_53876-27130.jpg?w=64&h=64"
            alt="Made in India"
            className="w-full h-auto"
          />
        </div>
        <p className="font-medium">
          {global_tagline} {name} | {cas}
        </p>
      </div>
    );
  }
  
  