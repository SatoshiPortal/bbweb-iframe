export default function Maintenance({language}) {

  return (
    <div>
      <h2 className="text-center dark:text-black">🇨🇷 {language.login.welcome} 🇨🇷</h2>
      <div className="text-center grid place-items-center" style={{minHeight: 400}}>
        <div className="w-full">
            
          <div className="m-4 mb-0 border rounded-lg border-blue-400 bg-blue-50 p-4">
            <p className="text-sm text-blue-700">
              {language.login.systemMaintenance}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}