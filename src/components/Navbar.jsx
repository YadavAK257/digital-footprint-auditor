function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold">
          PrivacyHub
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Welcome
        </span>

        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          U
        </div>
      </div>
    </header>
  );
}

export default Navbar;