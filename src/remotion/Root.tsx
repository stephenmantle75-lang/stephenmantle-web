import { Composition } from 'remotion'
import { AiReadinessHero } from './AiReadinessHero'
import { SystemsLoopVideo } from './SystemsLoopVideo'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="StephenMantleLoop"
        component={SystemsLoopVideo}
        durationInFrames={360}
        fps={30}
        width={1280}
        height={960}
      />
      <Composition
        id="AiReadinessHero"
        component={AiReadinessHero}
        durationInFrames={840}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}
