'use client';
import Link from 'next/link';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import { useApp } from '@/app/providers';

export const Footer = () => {
  const { initialData } = useApp(); // Use `initialData` directly from `AppContext`
  const menuItems = initialData?.menuItems || [];
  const footerBlock = menuItems.find(block => block.blockName === 'Quick Links');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-fluid mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerBlock?.menuItem
                .sort((a: { displayOrder: number; }, b: { displayOrder: number; }) => a.displayOrder - b.displayOrder)
                .map((item: { menuItemId: Key | null | undefined; pageDetails: { alias: any; }; menuItem: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                  <li key={item.menuItemId}>
                    <Link
                      href={`/${item.pageDetails.alias}`}
                      className="hover:text-blue-400 transition-colors"
                      rel="canonical"
                    >
                      {item.menuItem}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} CricketLive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};