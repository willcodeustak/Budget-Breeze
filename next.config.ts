import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals?.push?.({
			bufferutil: 'commonjs bufferutil',
			'utf-8-validate': 'commonjs utf-8-validate',
		});
		return config;
	},
};

export default nextConfig;
