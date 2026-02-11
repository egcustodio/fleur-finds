"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";

export default function TestPage() {
  const [status, setStatus] = useState({
    envVars: false,
    supabaseConnection: false,
    productsCount: 0,
    error: "",
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Check environment variables
      const hasEnvVars = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (!hasEnvVars) {
        setStatus({
          envVars: false,
          supabaseConnection: false,
          productsCount: 0,
          error: "Environment variables missing! Add them to Vercel.",
        });
        return;
      }

      // Test Supabase connection
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        setStatus({
          envVars: true,
          supabaseConnection: false,
          productsCount: 0,
          error: `Supabase error: ${error.message}`,
        });
        return;
      }

      setStatus({
        envVars: true,
        supabaseConnection: true,
        productsCount: data?.length || 0,
        error: "",
      });
    } catch (err: any) {
      setStatus({
        envVars: false,
        supabaseConnection: false,
        productsCount: 0,
        error: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🔧 Diagnostic Test Page
        </h1>

        <div className="space-y-4">
          {/* Environment Variables */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <div
              className={`w-4 h-4 rounded-full ${
                status.envVars ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div className="flex-1">
              <p className="font-medium">Environment Variables</p>
              <p className="text-sm text-gray-600">
                {status.envVars
                  ? "✅ Found NEXT_PUBLIC_SUPABASE_URL and ANON_KEY"
                  : "❌ Missing environment variables"}
              </p>
            </div>
          </div>

          {/* Supabase Connection */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <div
              className={`w-4 h-4 rounded-full ${
                status.supabaseConnection ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div className="flex-1">
              <p className="font-medium">Supabase Connection</p>
              <p className="text-sm text-gray-600">
                {status.supabaseConnection
                  ? "✅ Successfully connected to database"
                  : "❌ Cannot connect to Supabase"}
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <div
              className={`w-4 h-4 rounded-full ${
                status.productsCount > 0 ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <div className="flex-1">
              <p className="font-medium">Products in Database</p>
              <p className="text-sm text-gray-600">
                {status.productsCount > 0
                  ? `✅ Found ${status.productsCount} products`
                  : "⚠️ No products found - run supabase-setup.sql"}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {status.error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="font-medium text-red-800">Error:</p>
              <p className="text-sm text-red-600 font-mono mt-1">
                {status.error}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 rounded-lg bg-blue-50 border border-blue-200">
            <h2 className="font-bold text-blue-900 mb-3">What to do:</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              {!status.envVars && (
                <>
                  <li>
                    1. Go to Vercel Dashboard → Settings → Environment Variables
                  </li>
                  <li>
                    2. Add: NEXT_PUBLIC_SUPABASE_URL =
                    https://jzkfwsezcphtwentgtsh.supabase.co
                  </li>
                  <li>
                    3. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY =
                    sb_publishable_k-9JrVBC2eRDZOaEainAfg_5-WlbU16
                  </li>
                  <li>4. Redeploy your site</li>
                </>
              )}
              {status.envVars && !status.supabaseConnection && (
                <>
                  <li>
                    1. Check if your Supabase URL and Key are correct in Vercel
                  </li>
                  <li>2. Go to Supabase → Settings → API Keys</li>
                  <li>3. Copy the values again and update in Vercel</li>
                  <li>4. Redeploy</li>
                </>
              )}
              {status.supabaseConnection && status.productsCount === 0 && (
                <>
                  <li>1. Go to Supabase → SQL Editor</li>
                  <li>2. Copy all of supabase-setup.sql from your project</li>
                  <li>3. Paste and Run it</li>
                  <li>4. Refresh this page</li>
                </>
              )}
              {status.supabaseConnection && status.productsCount > 0 && (
                <>
                  <li className="text-green-700 font-medium">
                    ✅ Everything is working! You can now:
                  </li>
                  <li>- Visit /admin/login to access admin panel</li>
                  <li>- Create an admin user in Supabase Authentication</li>
                  <li>- Start managing your products!</li>
                </>
              )}
            </ul>
          </div>

          {/* System Info */}
          <div className="mt-6 p-4 rounded-lg bg-gray-100 text-xs font-mono">
            <p>
              <strong>Supabase URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET"}
            </p>
            <p>
              <strong>Anon Key:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                : "NOT SET"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
