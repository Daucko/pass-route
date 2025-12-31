'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Settings() {
  return (
    <>
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-10">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Settings ⚙️</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button className="glass-panel w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border border-white/10">
            <i className="fa-solid fa-bell text-sm lg:text-base" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Profile Settings */}
        <div className="glass-card">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h3 className="text-lg lg:text-xl font-semibold flex items-center gap-3">
              <i className="fa-solid fa-user" />
              Profile
            </h3>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <Image
                src="/default-profile.png"
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full mx-auto mb-4 border-4 border-white/10 w-16 h-16 lg:w-24 lg:h-24"
              />
              <Link
                href="/user-profile"
                className="cta-button bg-white/10 text-white px-4 lg:px-6 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300 text-sm lg:text-base"
              >
                Edit Profile
              </Link>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Full Name
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm lg:text-base">
                {user?.fullName || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Email
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm lg:text-base">
                {user?.emailAddresses?.[0]?.emailAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6 lg:space-y-8">
          <div className="glass-card">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-lg lg:text-xl font-semibold flex items-center gap-3">
                <i className="fa-solid fa-sliders" />
                Preferences
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm lg:text-base">
                    Dark Mode
                  </span>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Toggle application theme
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm lg:text-base">
                    Email Notifications
                  </span>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Receive weekly progress reports
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm lg:text-base">
                    Sound Effects
                  </span>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Play sounds during practice
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="glass-card border border-red-500/30">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-lg lg:text-xl font-semibold flex items-center gap-3 text-red-400">
                <i className="fa-solid fa-triangle-exclamation" />
                Account Management
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground text-sm lg:text-base">
                Manage your account settings and preferences.
              </p>
              <Link
                href="/user-profile"
                className="cta-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold shadow-lg shadow-purple-500/40 hover:scale-105 transition-all duration-300 block text-center text-sm lg:text-base"
              >
                Manage Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
