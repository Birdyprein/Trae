import StatusBar from './StatusBar';
import { apps, dockApps, AppIcon } from '../data/apps';

interface HomeScreenProps {
  onAppOpen: (app: AppIcon) => void;
}

export default function HomeScreen({ onAppOpen }: HomeScreenProps) {
  const handleAppClick = (app: AppIcon, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onAppOpen(app);
  };

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <StatusBar />

      <div className="flex-1 overflow-y-auto pt-4 px-4 pb-2">
        <div className="grid grid-cols-4 gap-y-5">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform duration-150"
              onClick={(e) => handleAppClick(app, e)}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl shadow-lg`}
              >
                {app.icon}
              </div>
              <span className="text-white text-xs font-medium drop-shadow-md">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-[32px] px-3 py-2">
          <div className="grid grid-cols-4 gap-1">
            {dockApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-center cursor-pointer active:scale-90 transition-transform duration-150"
                onClick={(e) => handleAppClick(app, e)}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-xl shadow-lg`}
                >
                  {app.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
