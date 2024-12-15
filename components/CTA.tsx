export default function CTA() {
  return (
    <section
      id="cta"
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-90"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Predict Your Visa Outcome?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Don't leave your travel plans to chance. Use our AI-powered prediction
          tool to get instant insights into your visa application's likelihood
          of success.
        </p>
        <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors">
          Start Your Free Prediction
        </button>
      </div>
    </section>
  );
}
