import Ballpit from "../bits-components/BallPit";
import LoginComponent from "../components/login_component";

export default function Login() {

    return (
        <>
            <div className="bg-black relative min-h-screen" >
                <LoginComponent />
                <Ballpit
                    count={12}
                    gravity={0.007}
                    friction={0.924}
                    wallBounce={1}
                    followCursor={false}
                    colors={["#bd7800", "#cc8100"]}
                />
            </div>
        </>
    );
}