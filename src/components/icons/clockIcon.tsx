export default function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.5 12.387V8.423q0-.212-.144-.356T12 7.923t-.356.144t-.143.356v4.037q0 .153.056.296t.186.275l2.833 2.832q.146.147.357.156q.21.01.356-.156q.14-.146.14-.347t-.14-.341zM12 6q.213 0 .357-.144T12.5 5.5v-1q0-.213-.144-.356Q12.212 4 12 4t-.356.144t-.143.356v1q0 .213.144.356Q11.788 6 12 6m6 6q0 .213.144.357t.356.143h1q.213 0 .356-.144Q20 12.212 20 12t-.144-.356t-.356-.143h-1q-.213 0-.356.144Q18 11.788 18 12m-6 6q-.213 0-.357.144t-.143.356v1q0 .213.144.356q.144.144.357.144t.356-.144t.143-.356v-1q0-.213-.144-.356Q12.212 18 12 18m-6-6q0-.213-.144-.357T5.5 11.5h-1q-.213 0-.356.144Q4 11.788 4 12t.144.356t.356.143h1q.213 0 .356-.144Q6 12.212 6 12m6.003 9q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.708-3.51t1.924-2.859t2.856-1.925T11.997 3t3.51.708t2.859 1.924t1.925 2.856t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"
      />
    </svg>
  );
}