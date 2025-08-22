import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-9xl mb-8">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Produit non trouvé
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Désolé, le modèle de moto que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-8 rounded-full hover:from-red-700 hover:to-red-600 transform hover:-translate-y-1 transition-all duration-300 mx-2"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/#products"
            className="inline-block bg-gray-100 text-gray-700 font-medium py-3 px-8 rounded-full hover:bg-gray-200 transition-colors mx-2"
          >
            Voir tous les modèles
          </Link>
        </div>
      </div>
    </section>
  );
}